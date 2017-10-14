<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205352_i18n_source_message extends Migration
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
            '{{%i18n_source_message}}',
            [
                'id'=> $this->primaryKey(11),
                'category'=> $this->string(32)->null()->defaultValue(null),
                'message'=> $this->text()->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%i18n_source_message}}');
    }
}
