<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205351_i18n_message extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%i18n_message}}',
            [
                'id'=> $this->primaryKey(11),
                'language'=> $this->string(16)->notNull(),
                'translation'=> $this->text()->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%i18n_message}}');
    }
}
