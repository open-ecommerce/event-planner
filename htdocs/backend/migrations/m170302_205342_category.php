<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205342_category extends Migration
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
            '{{%category}}',
            [
                'id'=> $this->integer(11)->notNull(),
                'category'=> $this->integer(11)->null()->defaultValue(0),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%category}}');
    }
}
