<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205418_widget_carousel extends Migration
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
            '{{%widget_carousel}}',
            [
                'id'=> $this->primaryKey(11),
                'key'=> $this->string(255)->notNull(),
                'status'=> $this->smallInteger(6)->null()->defaultValue(0),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%widget_carousel}}');
    }
}
